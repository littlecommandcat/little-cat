import os
from dotenv import load_dotenv
import requests
from html import escape

load_dotenv()

application_id = os.getenv("id")
bot_token = os.getenv("token")


url = f"https://discord.com/api/v10/applications/{application_id}/commands"

response = requests.get(
    url,
    headers={
        "Authorization": f"Bot {bot_token}"
    },
    timeout=10
)

response.raise_for_status()
commands = response.json()


def build_arguments(options):
    arguments = []

    for option in options:
        option_type = option.get("type")

        if option_type in (1, 2):
            continue

        option_name = escape(option.get("name", ""))
        option_description = escape(
            option.get("description", "無說明")
        )

        arguments.append(
            f'''                            <div class="argument">
                                <code>{option_name}</code>
                                <span>{option_description}</span>
                            </div>'''
        )

    if not arguments:
        return ""

    return f'''
                        <div class="command-arguments">

{chr(10).join(arguments)}

                        </div>
'''


def build_usage(path, options):
    usage = f"/{path}"

    for option in options:
        option_type = option.get("type")

        if option_type in (1, 2):
            continue

        name = escape(option.get("name", ""))

        if option.get("required"):
            usage += f" &lt;{name}&gt;"
        else:
            usage += f" [{name}]"

    return usage


def build_card(path, name, description, options, category):
    command_path = escape(path)
    command_name = escape(name)
    command_description = escape(description or "沒有提供說明。")

    usage = build_usage(path, options)

    copy_usage = usage.replace("&lt;", "<").replace("&gt;", ">")

    arguments = build_arguments(options)

    return f'''                    <article class="command-card" data-command="{command_path}">

                        <div class="command-header">

                            <div>
                                <span class="command-category">{escape(category)}</span>
                                <h3>/{command_path}</h3>
                            </div>

                            <button class="copy-command" type="button" data-copy="{escape(copy_usage)}">
                                複製
                            </button>

                        </div>

                        <p class="command-description">
                            {command_description}
                        </p>

                        <div class="command-block">

                            <span>使用方式</span>

                            <code>{usage}</code>

                        </div>
{arguments}
                    </article>
'''


def process_options(
    options,
    parent_path="",
    category="指令"
):
    cards = []

    for option in options:
        option_type = option.get("type")

        if option_type not in (1, 2):
            continue

        name = option.get("name", "")
        description = option.get("description", "")

        path = f"{parent_path} {name}".strip()

        if option_type == 2:
            current_category = "Sub Group"
        else:
            current_category = "Sub Command"

        children = option.get("options", [])

        if option_type == 1:
            cards.append(
                build_card(
                    path=path,
                    name=name,
                    description=description,
                    options=children,
                    category=current_category
                )
            )

        nested = process_options(
            children,
            parent_path=path,
            category=current_category
        )

        cards.extend(nested)

    return cards


cards = []

for command in commands:
    command_type = command.get("type", 1)

    if command_type != 1:
        continue

    name = command.get("name", "")
    description = command.get("description", "")
    options = command.get("options", [])

    has_subcommands = any(
        option.get("type") in (1, 2)
        for option in options
    )

    if not has_subcommands:
        cards.append(
            build_card(
                path=name,
                name=name,
                description=description,
                options=options,
                category="指令"
            )
        )
        continue

    for option in options:
        option_type = option.get("type")

        if option_type == 1:
            sub_name = option.get("name", "")
            sub_description = option.get("description", "")
            sub_options = option.get("options", [])

            path = f"{name} {sub_name}"

            cards.append(
                build_card(
                    path=path,
                    name=sub_name,
                    description=sub_description,
                    options=sub_options,
                    category=f"{name} / Sub Command"
                )
            )

            cards.extend(
                process_options(
                    sub_options,
                    parent_path=path,
                    category=f"{name} / Sub Command"
                )
            )

        elif option_type == 2:
            group_name = option.get("name", "")
            group_options = option.get("options", [])

            group_path = f"{name} {group_name}"

            for subcommand in group_options:
                if subcommand.get("type") != 1:
                    continue

                sub_name = subcommand.get("name", "")
                sub_description = subcommand.get("description", "")
                sub_options = subcommand.get("options", [])

                path = f"{group_path} {sub_name}"

                cards.append(
                    build_card(
                        path=path,
                        name=sub_name,
                        description=sub_description,
                        options=sub_options,
                        category=f"{name} / {group_name}"
                    )
                )

                cards.extend(
                    process_options(
                        sub_options,
                        parent_path=path,
                        category=f"{name} / {group_name}"
                    )
                )


output = "\n".join(cards)

OUTPUT_FILE = "./generator/output/commands.html"

with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
    file.write(output)

print(f"已取得 {len(cards)} 個指令")
print(f"輸出檔案：{OUTPUT_FILE}")