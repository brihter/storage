# ops

## prereq

```
curl -fsSL https://get.pulumi.com | sh
```

## provision

```
export AWS_PROFILE=profile

pulumi up -s test         # up
pulumi destroy -s test    # down
```
